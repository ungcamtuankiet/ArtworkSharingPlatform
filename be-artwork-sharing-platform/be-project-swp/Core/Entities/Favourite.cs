using System.ComponentModel.DataAnnotations.Schema;

namespace be_artwork_sharing_platform.Core.Entities
{
    [Table("favourites")]
    public class Favourite : BaseEntity<long>
    {
        public string User_Id { get; set; }
        public long Artwork_Id { get; set; }
        //Relation ship
        [ForeignKey("User_Id")]
        public ApplicationUser User { get; set; }

        [ForeignKey("Artwork_Id")]
        public Artwork Artworks { get; set; } 
    }
}
