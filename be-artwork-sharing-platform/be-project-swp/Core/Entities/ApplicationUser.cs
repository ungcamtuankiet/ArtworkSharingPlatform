using be_project_swp.Core.Entities;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_artwork_sharing_platform.Core.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string NickName { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdateAt {  get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;

        [NotMapped]
        public IList<string> Roles { get; set; }

        //Relationship
        public List<Artwork> Artworks { get; set; }
        public List<Favourite> Favorites { get; set; }
        public List<Payment> Payments { get; set; }
        public List<Order> Orders { get; set; }
        public List<OrderDetailRequest> OrderDetailRequests { get; set; }
        public List<RequestOrder> RequestOrders { get; set; }
    }
}
