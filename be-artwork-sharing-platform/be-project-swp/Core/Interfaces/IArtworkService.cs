using be_artwork_sharing_platform.Core.Dtos.Artwork;
using be_artwork_sharing_platform.Core.Entities;
using be_project_swp.Core.Dtos.Artwork;
using be_project_swp.Core.Dtos.Response;
using System.Security.Claims;

namespace be_artwork_sharing_platform.Core.Interfaces
{
    public interface IArtworkService
    {
        Task<IEnumerable<ArtworkDto>> GetAll();
        Task<IEnumerable<Artwork>> GetArtworkForAdmin(string? getBy);
        Task<IEnumerable<Artwork>> SearchArtwork(string? search, string? searchBy, double? from, double? to, string? sortBy);
        Task<ArtworkDto> GetById(long id);
        Task<IEnumerable<ArtworkDto>> GetByNickName(string nickName);
        Task<IEnumerable<GetArtworkByUserId>> GetArtworkByUserId(string user_Id);
        Task<GeneralServiceResponseDto> CreateArtwork(CreateArtwork artworkDto, string user_Id, string user_Name);
        Task<GeneralServiceResponseDto> Delete(long id, string user_Id);
        Task<int> DeleteSelectedArtworks(List<long> selectedIds);

        Task<GeneralServiceResponseDto> UpdateArtwork(long id, UpdateArtwork updateArtwork, string user_Id);
        Task AcceptArtwork(long id, AcceptArtwork acceptArtwork, string userName);
        Task RefuseArtwork(long id, RefuseArtwork refuseArtwork, string userName);
        bool GetStatusIsActiveArtwork(long id);
        bool GetStatusIsDeleteArtwork(long id);
        Task DownloadImage(string firebaseUrl, string customFolderPath);
    }
}
