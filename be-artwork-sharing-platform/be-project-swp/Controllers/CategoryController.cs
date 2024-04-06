using AutoMapper;
using be_artwork_sharing_platform.Core.Constancs;
using be_artwork_sharing_platform.Core.Dtos.Category;
using be_artwork_sharing_platform.Core.Entities;
using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Dtos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace be_artwork_sharing_platform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICategoryService _categoryService;
        private readonly ILogService _logService;
        private readonly IAuthService _authService;

        public CategoryController(IMapper mapper, ICategoryService categoryService, ILogService logService, IAuthService authService)
        {
            _mapper = mapper;
            _categoryService = categoryService;
            _logService = logService;
            _authService = authService;
        }

        [HttpGet]
        [Route("get-all-category")]
        public IActionResult GetAll()
        {
            var categories = _categoryService.GetAll();
            
            return Ok(_mapper.Map<List<CategoryDto>>(categories));
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetById(long id)
        {
            try
            {
                var category = _categoryService.GetById(id);
                if (category is null) return NotFound("Category not found");
                return Ok(_mapper.Map<CategoryDto>(category));
            }
            catch
            {
                return BadRequest("Something wrong");
            }
        }

        [HttpPost]
        [Route("create")]
        [Authorize(Roles = StaticUserRole.ADMIN)]
        public async Task<ActionResult<GeneralServiceResponseDto>> CreateCategory([FromBody] CreateCategory category)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                var result = await _categoryService.CreateCategory(category, userName);
                return StatusCode(result.StatusCode, result.Message);
            }
            catch
            {
                return BadRequest("Error creating category");
            }
        }

        [HttpDelete]
        [Route("delete")]
        [Authorize(Roles = StaticUserRole.ADMIN)]
        public async Task<IActionResult> DeleteCategory(long id)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                var result = _categoryService.Delete(id);
                if(result > 0)
                {
                    await _logService.SaveNewLog(userName, "Delete Category Successfully");
                    return Ok(new GeneralServiceResponseDto
                    {
                        IsSucceed = true,
                        StatusCode = 200,
                        Message = "Delete Successfully"
                    });
                }
                else
                {
                    _logService.SaveNewLog(userName, "Delete Category Failed");
                    return BadRequest(new GeneralServiceResponseDto
                    {
                        IsSucceed = false,
                        StatusCode = 400,
                        Message = "Delete Failed"
                    });
                }
            }
            catch
            {
                return BadRequest("Error delete category");
            }
        }

        [HttpGet]
        [Route("categorynames")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategoryNameList()
        {
            var categoryNames = await _categoryService.GetCategortNameListAsync();
            return Ok(categoryNames);
        }
    }
}
