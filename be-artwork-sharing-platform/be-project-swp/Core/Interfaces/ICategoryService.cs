using be_artwork_sharing_platform.Core.Dtos.Category;
using be_artwork_sharing_platform.Core.Entities;
using be_project_swp.Core.Dtos.Response;

namespace be_artwork_sharing_platform.Core.Interfaces
{
    public interface ICategoryService
    {
        IEnumerable<Category> GetAll();
        Category GetById(long id);
        Task<GeneralServiceResponseDto> CreateCategory(CreateCategory category, string userName);
        int Delete(long id);
        Task<IEnumerable<string>> GetCategortNameListAsync();
    }
}
