using be_artwork_sharing_platform.Core.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace be_project_swp.Core.Entities
{
    [Table("orderdetailrequests")]
    public class OrderDetailRequest : BaseEntity<long>
    {
        public string User_Id { get; set; }
        public string Payment_Id { get; set; }
        public long Request_Id { get; set; }
        public string NickName_Request { get; set; }
        public string NickName_Receivier { get; set; }
        public double Price { get; set; }
        public string Url_Image { get; set; }
        public bool IsPayment { get; set; }
        public string Text { get; set; }
        public bool IsSendResult { get; set; }
        public string Text_Result { get; set; }
        public ApplicationUser User { get; set; }
        [ForeignKey("Payment_Id")]
        public Payment Payment { get; set; }
        [ForeignKey("Request_Id")]
        public RequestOrder RequestOrder { get; set; }
    }
}
