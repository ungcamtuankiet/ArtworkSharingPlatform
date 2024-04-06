using be_artwork_sharing_platform.Core.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_project_swp.Core.Entities
{
    [Table("orders")]
    public class Order : BaseEntity<long>
    {
        public string User_Id { get; set; }
        public string Payment_Id { get; set; }
        public long Artwork_Id { get; set; }
        public string NickName_Buyer { get; set; }
        public string NickName_Seller { get; set; }
        public double Price { get; set; }
        public string Url_Image { get; set; }
        public string Name_Artwork { get; set; }
        public string Category_Artwork { get; set; }
        public ApplicationUser User { get; set; }
        public Payment Payment { get; set; }
        [ForeignKey("Artwork_Id")]
        public Artwork Artwork { get; set; }
    }
}
