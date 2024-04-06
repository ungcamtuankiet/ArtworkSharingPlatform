using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Dtos.Artwork;
using be_artwork_sharing_platform.Core.Entities;
using be_artwork_sharing_platform.Core.Interfaces;
using be_project_swp.Core.Dtos.Artwork;
using be_project_swp.Core.Dtos.Response;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace be_artwork_sharing_platform.Core.Services
{
    public class ArtworkService : IArtworkService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;
        private readonly ILogService _logService;


        public ArtworkService(ApplicationDbContext context, IAuthService authService, ILogService logService)
        {
            _context = context;
            _authService = authService;
            _logService = logService;
        }

        public async Task<IEnumerable<ArtworkDto>> GetAll()
        {
            var artworks = await _context.Artworks.Where(a => a.IsActive == true && a.IsDeleted == false)
                .Select(a => new ArtworkDto
                {
                    Id = a.Id,
                    User_Id = a.User_Id,
                    Nick_Name = a.Nick_Name,
                    Category_Name = a.Category_Name,
                    Name = a.Name,
                    Description = a.Description,
                    Url_Image = a.Url_Image,
                    Price = a.Price,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt,
                    IsActive = a.IsActive,
                    IsDeleted = a.IsDeleted,
                    Owner = a.Owner,
                    IsPayment = a.IsPayment
                }).ToListAsync();
            return artworks;
        }

        public async Task<IEnumerable<Artwork>> SearchArtwork(string? search, string? searchBy, double? from, double? to, string? sortBy)
        {
            var artworks = _context.Artworks.Include(a => a.Category).AsQueryable();
            artworks = artworks.Where(a => a.IsActive == true && a.IsDeleted == false);
            #region Filter
            if (searchBy is null)
            {
                if (!string.IsNullOrEmpty(search))
                {
                    artworks = artworks.Where(a => a.Name.Contains(search));
                }
            }
            if (searchBy is not null)
            {
                if (searchBy.Equals("category_name"))
                {
                    if (!string.IsNullOrEmpty(search))
                    {
                        artworks = artworks.Where(a => a.Category_Name.Contains(search));
                    }
                }
                else if (searchBy.Equals("nick_name"))
                    if (!string.IsNullOrEmpty(search))
                    {
                        artworks = artworks.Where(a => a.Nick_Name.Contains(search));
                    }
            }
            if (from.HasValue)
            {
                artworks = artworks.Where(a => a.Price >= from);
            }
            if (to.HasValue)
            {
                artworks = artworks.Where(a => a.Price <= to);
            }
            #endregion

            #region Sorting
            artworks = artworks.OrderBy(a => a.Name);

            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy)
                {
                    case "price_asc":
                        artworks = artworks.OrderBy(a => a.Price);
                        break;
                    case "price_desc":
                        artworks = artworks.OrderByDescending(a => a.Price);
                        break;
                }
            }
            #endregion
            return artworks.ToList();
        }

        public async Task<IEnumerable<Artwork>> GetArtworkForAdmin(string? getBy)
        {
            var artworks = _context.Artworks.Include(a => a.Category).AsQueryable();
            #region Filter 
            if (getBy == null)
                artworks = artworks.OrderByDescending(a => a.CreatedAt);
            else
            {
                if (getBy.Equals("is_active_false"))
                {
                    artworks = artworks.Where(a => a.IsActive == false && a.IsDeleted == false);
                }
                else if (getBy.Equals("is_active_true"))
                {
                    artworks = artworks.Where(a => a.IsActive == true && a.IsDeleted == false);
                }
                else if (getBy.Equals("is_delete_true"))
                {
                    artworks = artworks.Where(a => a.IsDeleted == true && a.IsActive == false);
                }
            }
            #endregion
            return artworks.ToList();
        }

        public async Task<IEnumerable<GetArtworkByUserId>> GetArtworkByUserId(string user_Id)
        {
            try
            {
                var artworks = _context.Artworks.Where(a => a.User_Id == user_Id)
                .Select(a => new GetArtworkByUserId
                {
                    Id = a.Id,
                    User_Id = a.User_Id,
                    Nick_Name = a.Nick_Name,
                    Category_Name = a.Category_Name,
                    Name = a.Name,
                    Description = a.Description,
                    Url_Image = a.Url_Image,
                    Price = a.Price,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt,
                    IsActive = a.IsActive,
                    IsDeleted = a.IsDeleted,
                    ReasonRefuse = a.ReasonRefuse,
                    Owner = a.Owner,
                    IsPayment = a.IsPayment,
                }).ToList()
                .OrderBy(a => a.CreatedAt);
                return artworks;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AcceptArtwork(long id, AcceptArtwork acceptArtwork, string userName)
        {
            var accept = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
            if (accept is not null)
            {
                await _logService.SaveNewLog(userName, "Accept Artwork");
                accept.IsActive = acceptArtwork.IsActive;
                accept.ReasonRefuse = "Processed by Admin";
            }
            _context.Update(accept);
            _context.SaveChanges();
        }

        public async Task RefuseArtwork(long id, RefuseArtwork refuseArtwork, string userName)
        {
            var refuse = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
            if(refuse is not null)
            {
                await _logService.SaveNewLog(userName, "Refuse Artwork");
                refuse.IsDeleted = true;
                refuse.ReasonRefuse = refuseArtwork.Reason;
            }
            _context.Update(refuse);
            _context.SaveChanges();
        }

        public async Task<ArtworkDto> GetById(long id)
        {
            var artwork = _context.Artworks.FirstOrDefault(a => a.Id == id);
            if(artwork != null)
            {
                var artworkDto = new ArtworkDto
                {
                    Id = artwork.Id,
                    User_Id = artwork.User_Id,
                    Nick_Name = artwork.Nick_Name,
                    Category_Name = artwork.Category_Name,
                    Name = artwork.Name,
                    Description = artwork.Description,
                    Url_Image = artwork.Url_Image,
                    Price = artwork.Price,
                    CreatedAt = artwork.CreatedAt,
                    UpdatedAt = artwork.UpdatedAt,
                    IsActive = artwork.IsActive,
                    IsDeleted = artwork.IsDeleted,
                    Owner = artwork.Owner,
                    IsPayment = artwork.IsPayment
                };
                return artworkDto;
            }
            return null;
        }

        public async Task<IEnumerable<ArtworkDto>> GetByNickName(string nickName)
        {
            var artworks = await _context.Artworks.Where(a => a.Nick_Name == nickName && a.IsActive == true && a.IsDeleted == false)
                .Select(a => new ArtworkDto
                {
                    Id = a.Id,
                    User_Id = a.User_Id,
                    Nick_Name = a.Nick_Name,
                    Category_Name = a.Category_Name,
                    Name = a.Name,
                    Description = a.Description,
                    Url_Image = a.Url_Image,
                    Price = a.Price,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt,
                    IsActive = a.IsActive,
                    IsDeleted = a.IsDeleted,
                    Owner = a.Owner,
                    IsPayment = a.IsPayment
                }).ToListAsync();
            return artworks;
        }

        public async Task<GeneralServiceResponseDto> CreateArtwork(CreateArtwork artworkDto, string user_Id, string user_Name)
        {
            var category = _context.Categories.FirstOrDefault(c => c.Name == artworkDto.Category_Name);
            if(category is null)
            {
                return new GeneralServiceResponseDto()
                {
                    IsSucceed = false,
                    StatusCode = 404,
                    Message = "Category not found"
                };
            }
            var artwork = new Artwork
            {
                User_Id = user_Id,
                Nick_Name = user_Name,
                Category_Name = artworkDto.Category_Name,
                Name = artworkDto.Name,
                Description = artworkDto.Description,
                Price = artworkDto.Price,
                Url_Image = artworkDto.Url_Image,
                Category_Id = category.Id,
            };
            if(artwork.Price == 0)
            {
                artwork.IsPayment = true;
            }
            await _context.Artworks.AddAsync(artwork);
            await _context.SaveChangesAsync();
            return new GeneralServiceResponseDto()
            {
                IsSucceed = true,
                StatusCode = 201,
                Message = "Create Artwork Successfully"
            };
        }

        public async Task<GeneralServiceResponseDto> Delete(long id, string user_Id)
        {
            try
            {
                var artwork = _context.Artworks.FirstOrDefault(a => a.Id == id);
                var checkUser = _context.Artworks.FirstOrDefault(a => a.User_Id == user_Id && a.Id == id);
                if (artwork == null)
                {
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = false,
                        StatusCode = 404,
                        Message = "Artwork not found"
                    };
                }
                else
                {
                    if(checkUser != null)
                    {
                        if(artwork.Owner != "")
                        {
                            return new GeneralServiceResponseDto()
                            {
                                IsSucceed = false,
                                StatusCode = 400,
                                Message = $"Delete Artwork Failed because this Artwork is already owned by {artwork.Owner}"
                            };
                        }
                        _context.Remove(artwork);
                        _context.SaveChanges();
                        return new GeneralServiceResponseDto()
                        {
                            IsSucceed = true,
                            StatusCode = 200,
                            Message = "Delete Artwork Successfully"
                        };
                    }
                    else
                    {
                        return new GeneralServiceResponseDto()
                        {
                            IsSucceed = false,
                            StatusCode = 400,
                            Message = "You can not delete artwork of another user"
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<GeneralServiceResponseDto> UpdateArtwork(long id, UpdateArtwork updateArtwork, string user_Id)
        {
            try
            {
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == updateArtwork.Category_Name);
                var artwork = await _context.Artworks.FirstOrDefaultAsync(a => a.Id == id);
                if (artwork is not null)
                {
                    var checkUser = await _context.Artworks.FirstOrDefaultAsync(a => a.User_Id == user_Id && a.Id == id);
                    if(checkUser is null)
                    {
                        return new GeneralServiceResponseDto()
                        {
                            IsSucceed = false,
                            StatusCode = 400,
                            Message = "You can not update artwork of another user"
                        };
                    }
                    else
                    {
                        if (category is null)
                        {
                            return new GeneralServiceResponseDto()
                            {
                                IsSucceed = false,
                                StatusCode = 404,
                                Message = "Category not found"
                            };
                        }
                        else
                        {
                            if(artwork.Owner == "")
                            {
                                artwork.Name = updateArtwork.Name;
                                artwork.Category_Name = updateArtwork.Category_Name;
                                artwork.Description = updateArtwork.Description;
                                artwork.Url_Image = updateArtwork.Url_Image;
                                artwork.Price = updateArtwork.Price;
                                artwork.IsActive = false;
                                artwork.ReasonRefuse = "Processing";
                                _context.Update(artwork);
                                _context.SaveChanges();
                                return new GeneralServiceResponseDto()
                                {
                                    IsSucceed = true,
                                    StatusCode = 200,
                                    Message = "Update Artwork Successfully"
                                };
                            }
                            else
                            {
                                return new GeneralServiceResponseDto()
                                {
                                    IsSucceed = false,
                                    StatusCode = 400,
                                    Message = $"You cannot update this artwork because it is already owned by {artwork.Owner}"
                                };
                            }
                        }  
                    }
                }
                else if (artwork is null)
                {
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = false,
                        StatusCode = 404,
                        Message = "Artwork not found"
                    };
                }
                else
                {
                    return new GeneralServiceResponseDto()
                    {
                        IsSucceed = false,
                        StatusCode = 400,
                        Message = "Update Artwork Failed"
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public bool GetStatusIsActiveArtwork(long id)
        {
            var status = _context.Artworks.FirstOrDefault(b => b.Id == id);
            return status.IsActive;
        }

        public bool GetStatusIsDeleteArtwork(long id)
        {
            var status = _context.Artworks.FirstOrDefault(b => b.Id == id);
            return status.IsDeleted;
        }

        public async Task<int> DeleteSelectedArtworks(List<long> selectedIds)
        {
            var artworksToDelete = await _context.Artworks.Where(a => selectedIds.Contains(a.Id)).ToListAsync();
            if (artworksToDelete.Count > 0)
            {
                var checkArtwork = await _context.Artworks.Where(a => a.IsPayment == true && a.Owner != "").ToListAsync();
                if (checkArtwork.Count > 0)
                {
                    _context.RemoveRange(artworksToDelete);
                    await _context.SaveChangesAsync();
                    return 1;
                }
                else return -1;
            }
            else  return 0;
        }

        //Tham khảo ChatGPT
        public async Task DownloadImage(string firebaseUrl, string customFolderPath)
        {
            var request = new DownloadRequest
            {
                FirebaseUrl = firebaseUrl,
                CustomFolderPath = customFolderPath
            };

            var httpClient = new HttpClient();
            var json = JsonSerializer.Serialize(request);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync("https://yourapi.com/download", content);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                Console.WriteLine(result); // Đồng bộ với UI hoặc xử lý kết quả ở đây
            }
            else
            {
                Console.WriteLine("Failed to download image: " + response.ReasonPhrase);
            }
        }
    }
}
