using AutoMapper;

namespace be_artwork_sharing_platform.Core.Dtos.Category
{
    public class CategoryDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } 
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }

    }
}
