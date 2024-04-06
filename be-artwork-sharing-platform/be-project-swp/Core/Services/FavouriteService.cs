using be_artwork_sharing_platform.Core.DbContext;
using be_artwork_sharing_platform.Core.Dtos.Category;
using be_artwork_sharing_platform.Core.Dtos.Favourite;
using be_artwork_sharing_platform.Core.Entities;
using be_artwork_sharing_platform.Core.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace be_artwork_sharing_platform.Core.Services
{
    public class FavouriteService : IFavouriteService
    {
        private readonly ApplicationDbContext _context;

        public FavouriteService(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<GetFavourite> GetFavouritesByUserId(string user_Id)
        {
            var artwork_Id = GetFavouriteIdByUserId(user_Id);
            var checkFavourite = _context.Favorites.FirstOrDefault(f => f.User_Id == user_Id && f.Artwork_Id == artwork_Id);
            if(checkFavourite != null)
            {
                var favourites = _context.Favorites.Where(f => f.User_Id == user_Id)
                    .Select(f => new GetFavourite
                    {
                        Favourite_Id = f.Id,
                        Artwork_Id = f.Artworks.Id,
                        Category_Name = f.Artworks.Category_Name,
                        Full_Name = f.Artworks.Nick_Name,
                        Name = f.Artworks.Name,
                        Description = f.Artworks.Description,
                        Url_Image = f.Artworks.Url_Image,
                        Price = f.Artworks.Price,
                        CreatedAt = f.Artworks.CreatedAt,
                        UpdatedAt = f.Artworks.UpdatedAt,
                        IsActive = f.Artworks.IsActive,
                        IsDeleted = f.Artworks.IsDeleted,
                        IsPayment = f.Artworks.IsPayment,
                        Owner = f.Artworks.Owner
                    }).ToList();
                return favourites;
            }
            return null;
        }
        public async Task<long> AddToFavourite(string userId, long artworkId, long favourite_Id)
        {
            var favourite = new Favourite
            {
                Id = favourite_Id,
                Artwork_Id = artworkId,
                User_Id = userId,
            };
            await _context.Favorites.AddAsync(favourite);
            await _context.SaveChangesAsync();
            return favourite.Id;
        }

        public int RemoveArtwork(long favourite_Id, string user_Id)
        {
            var favourite = _context.Favorites.FirstOrDefault(f => f.Id == favourite_Id && f.User_Id == user_Id);
            if (favourite == null) return 0;
            _context.Remove(favourite);
            return _context.SaveChanges();
        }

        public long GetFavouriteIdByUserId(string user_Id)
        {
            var checkUser =  _context.Favorites.FirstOrDefault(f => f.User_Id == user_Id);
            if(checkUser != null)
            {
                return checkUser.Artwork_Id;
            }
            return 0;
        }
    }
}
