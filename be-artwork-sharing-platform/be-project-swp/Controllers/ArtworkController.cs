using AutoMapper;
using be_artwork_sharing_platform.Core.Constancs;
using be_artwork_sharing_platform.Core.Dtos.Artwork;
using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Dtos.Artwork;
using be_project_swp.Core.Dtos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace be_artwork_sharing_platform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtworkController : ControllerBase
    {
        private readonly IArtworkService _artworkService;
        private readonly IAuthService _authService;
        private readonly ILogService _logService;
        private readonly IMapper _mapper;
        private readonly IHttpClientFactory _clientFactory;
        private readonly string ImageFolderPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");

        public ArtworkController(IArtworkService artworkService, IAuthService authService, ILogService logService, IMapper mapper, IHttpClientFactory clientFactory)
        {
            _artworkService = artworkService;
            _authService = authService;
            _logService = logService;
            _mapper = mapper;
            _clientFactory = clientFactory;
        }

        [HttpGet]
        [Route("get-all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var artworks = await _artworkService.GetAll();
                return Ok(artworks);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("search")]
        public async Task<IActionResult> Search(string? search, string? searchBy, double? from, double? to, string? sortBy)
        {
            var artworks = await _artworkService.SearchArtwork(search, searchBy, from, to, sortBy);
            if (artworks is null)
                return NotFound("Artworks not available");
            return Ok(_mapper.Map<List<ArtworkDto>>(artworks));
        }

        [HttpGet]
        [Route("get-by-userId")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<IActionResult> GetByUserIdAsync()
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                var artworks = await _artworkService.GetArtworkByUserId(userId);
                if (artworks is null) return null;
                return Ok(artworks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetById([FromRoute]long id)
        {
            try
            {
                var artwork = await _artworkService.GetById(id);
                if(artwork is null)
                    return NotFound(new GeneralServiceResponseDto
                    {
                        IsSucceed = false,
                        StatusCode = 204,
                        Message = "Artwork not found"
                    });
                else
                {
                    return Ok(artwork);
                }
            }
            catch
            {
                return BadRequest("Somethong wrong");
            }
        }

        [HttpGet]
        [Route("get-by-nickName")]
        public async Task<IActionResult> GetByNickName(string nick_Name)
        {
            var artworks = await _artworkService.GetByNickName(nick_Name);
            return Ok(artworks);
        }

        [HttpPost]
        [Route("create")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<ActionResult<GeneralServiceResponseDto>> Create(CreateArtwork artworkDto)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                string userNickNameCurrent = await _authService.GetCurrentNickName(userName);
                var result = await _artworkService.CreateArtwork(artworkDto, userId, userNickNameCurrent);
                await _logService.SaveNewLog(userName, "Create New Artwork");
                return StatusCode(result.StatusCode, result.Message);
            }
            catch
            {
                return BadRequest("Create Artwork Failed");
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<ActionResult<GeneralServiceResponseDto>> Delete([FromRoute] long id)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                var result = await _artworkService.Delete(id, userId);
                return StatusCode(result.StatusCode, result.Message);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete-by-id-select")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<IActionResult> Delete([FromBody] List<long> ids)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                int deletedCount = await _artworkService.DeleteSelectedArtworks(ids);
                if (deletedCount == 1)
                {
                    await _logService.SaveNewLog(userName, $"Deleted {deletedCount} Artwork(s)");
                    return Ok(new GeneralServiceResponseDto
                    {
                        IsSucceed = true,
                        StatusCode = 200,
                        Message = $"Deleted {deletedCount} Artwork(s) Successfully"
                    });
                }
                else if(deletedCount == 0)
                {
                    return NotFound(new GeneralServiceResponseDto
                    {
                        IsSucceed = true,
                        StatusCode = 404,
                        Message = "No Artwork(s) Found to Delete"
                    });
                }
                else
                {
                    return BadRequest(new GeneralServiceResponseDto
                    {
                        IsSucceed = false,
                        StatusCode = 400,
                        Message = $"Deleted Artwork Failed because Artwork sold"
                    });
                }
            }
            catch
            {
                return BadRequest("Delete Failed");
            }
        }

        [HttpPut]
        [Route("update-artwork")]
        [Authorize(Roles = StaticUserRole.CREATOR)]
        public async Task<ActionResult<GeneralServiceResponseDto>> UpdateArtwork(long id, UpdateArtwork artworkDt)
        {
            try
            {
                string userName = HttpContext.User.Identity.Name;
                string userId = await _authService.GetCurrentUserId(userName);
                string userNameCurrent = await _authService.GetCurrentUserName(userName);
                await _logService.SaveNewLog(userName, "Update Artwork");
                var result = await _artworkService.UpdateArtwork(id, artworkDt, userId);
                return StatusCode(result.StatusCode, result.Message);
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }

        /*[HttpGet]
        [Route("download")]
        public async Task<IActionResult> DownloadImageFromFirebase(string firebaseUrl)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(firebaseUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        Stream imageStream = await response.Content.ReadAsStreamAsync();
                        string fileName = Guid.NewGuid().ToString() + ".jpg"; // Generate a unique filename
                        string filePath = Path.Combine(ImageFolderPath, fileName);

                        using (FileStream fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageStream.CopyToAsync(fileStream);
                        }

                        return Ok("Image downloaded successfully to " + filePath);
                    }
                    else
                    {
                        return NotFound("Image not found");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred: " + ex.Message);
            }
        }*/

        [HttpGet]
        [Route("download")]
        public async Task<IActionResult> DownloadImageFromFirebase(string firebaseUrl)
        {
            try
            {
                var client = _clientFactory.CreateClient();

                HttpResponseMessage response = await client.GetAsync(firebaseUrl);
                if (response.IsSuccessStatusCode)
                {
                    Stream imageStream = await response.Content.ReadAsStreamAsync();
                    return File(imageStream, "application/octet-stream", "image.jpg");
                }
                else
                {
                    return NotFound("Image not found");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred: " + ex.Message);
            }
        }

        /*[HttpGet]
        [Route("download")]
        public async Task<IActionResult> DownloadImageFromFirebase(string firebaseUrl, string customFolderPath)
        {
            try
            {
                if (string.IsNullOrEmpty(customFolderPath))
                {
                    return BadRequest("Custom folder path is required.");
                }

                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(firebaseUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        Stream imageStream = await response.Content.ReadAsStreamAsync();
                        string fileName = Guid.NewGuid().ToString() + ".jpg"; // Generate a unique filename
                        string filePath = Path.Combine(customFolderPath, fileName);

                        using (FileStream fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageStream.CopyToAsync(fileStream);
                        }

                        return Ok("Image downloaded successfully to " + filePath);
                    }
                    else
                    {
                        return NotFound("Image not found");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred: " + ex.Message);
            }
        }*/

        /*[HttpPost]
        [Route("download")]
        public async Task<IActionResult> DownloadImage([FromBody] DownloadRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.FirebaseUrl) || string.IsNullOrEmpty(request.CustomFolderPath))
                {
                    return BadRequest("Firebase URL and custom folder path are required.");
                }

                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(request.FirebaseUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        Stream imageStream = await response.Content.ReadAsStreamAsync();
                        string fileName = Guid.NewGuid().ToString() + ".jpg"; // Generate a unique filename
                        string filePath = Path.Combine(request.CustomFolderPath, fileName);

                        using (FileStream fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageStream.CopyToAsync(fileStream);
                        }

                        return Ok("Image downloaded successfully to " + filePath);
                    }
                    else
                    {
                        return NotFound("Image not found");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred: " + ex.Message);
            }
        }*/
    }
}


