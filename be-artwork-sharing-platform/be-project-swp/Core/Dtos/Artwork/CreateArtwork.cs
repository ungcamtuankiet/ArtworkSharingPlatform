using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_artwork_sharing_platform.Core.Dtos.Artwork
{
    public class CreateArtwork
    {
        public string Name { get; set; }
        public string Category_Name { get; set; }
        public string? Description { get; set; }
        [Range(0, Double.MaxValue, ErrorMessage = "Price must be >= 0")]
        public double Price { get; set; } = 0;
        public string Url_Image { get; set; }
        
    }
}
