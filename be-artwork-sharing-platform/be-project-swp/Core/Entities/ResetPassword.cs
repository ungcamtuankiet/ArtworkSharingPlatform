using be_artwork_sharing_platform.Core.Entities;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_project_swp.Core.Entities
{
    [Table("resetpasswords")]
    public class ResetPassword
    {
        [Key]
        public int Id { get; set; }
        public string User_Id { get; set; }
        [StringLength(256)]
        public string Email { get; set; }
        [StringLength(500)]
        public string Token { get; set; }
        [StringLength(10)]
        public string OTP { get; set; }
        public DateTime InsertDateTimeUTC { get; set; }
        [ForeignKey("User_Id")]
        public ApplicationUser User { get; set; }
    }
}
