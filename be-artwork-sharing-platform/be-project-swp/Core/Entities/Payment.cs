using be_artwork_sharing_platform.Core.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_project_swp.Core.Entities
{
    [Table("payments")]
    public class Payment 
    {
        [Key]
        [Required]
        public string Id { get; set; }
        public string Order_Id { get; set; }
        public string User_Id { get; set; }
        public long? Artwork_Id { get; set; } 
        public long? Request_Id { get; set; } 
        // RelationShip
        public ApplicationUser User { get; set; } 
        public Artwork Artworks { get; set; } 
        public RequestOrder RequestOrders { get; set; }
        /*public Order Order { get; set; } */
        public List<Order> Orders { get; set; }

    }
}
