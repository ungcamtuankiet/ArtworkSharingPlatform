using be_artwork_sharing_platform.Core.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;

namespace be_project_swp.Core.Entities
{
    [Table("reports")]
    public class Report 
    {
        public long Id { get; set; }
        public string User_Id { get; set; }
        public string NickName_Reporter { get; set; }
        public string NickName_Accused { get; set; }
        public string Reason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = false;
        public bool IsDeleted { get; set; } = false;
        public string Reason_Delete { get; set; }
    }
}
