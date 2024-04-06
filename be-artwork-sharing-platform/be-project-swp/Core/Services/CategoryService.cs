using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Dtos.Category;
using be_artwork_sharing_platform.Core.Entities;
using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Dtos.Response;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace be_artwork_sharing_platform.Core.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;

        public CategoryService(ApplicationDbContext context, ILogService logService)
        {
            _context = context;
            _logService = logService;
        }

        public IEnumerable<Category> GetAll()
        {
            return _context.Categories.ToList();
        }

        public Category GetById(long id)
        {
            return _context.Categories.Find(id) ?? throw new Exception("Category not found");
        }

        public async Task<GeneralServiceResponseDto> CreateCategory(CreateCategory category, string userName)
        {
            var _category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == category.Name);
            if (_category == null)
            {
                var newCategory = new Category()
                {
                    Name = category.Name,
                };
                await _context.Categories.AddAsync(newCategory);
                await _context.SaveChangesAsync();
                await _logService.SaveNewLog(userName, "Create New Category");
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = true,
                    StatusCode = 200,
                    Message = "Create Category Successfully"
                };
            }
            return new GeneralServiceResponseDto()
            {
                IsSucceed = false,
                StatusCode = 400,
                Message = "Category already exists"
            };
        }

        public int Delete(long id)
        {
            var category = _context.Categories.Find(id) ?? throw new Exception("Category not found");
            _context.Categories.Remove(category);
            return _context.SaveChanges();
        }

        public async Task<IEnumerable<string>> GetCategortNameListAsync()
        {
            var categortName = await _context.Categories
                .Select(q => q.Name)
                .ToListAsync();

            return categortName;
        }
    }
}
