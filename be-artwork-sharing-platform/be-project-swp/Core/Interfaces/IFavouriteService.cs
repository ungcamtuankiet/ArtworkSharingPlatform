using be_artwork_sharing_platform.Core.Dtos.Category;
using be_artwork_sharing_platform.Core.Dtos.Favourite;
using be_artwork_sharing_platform.Core.Entities;

namespace be_artwork_sharing_platform.Core.Interfaces
{
    public interface IFavouriteService
    {
        Task<long> AddToFavourite(string userId, long artworkId, long favourite_Id);
        int RemoveArtwork(long artwork_Id, string user_Id);
        IEnumerable<GetFavourite> GetFavouritesByUserId(string user_Id);
        long GetFavouriteIdByUserId(string user_Id);
    }
}
