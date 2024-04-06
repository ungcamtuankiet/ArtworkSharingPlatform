using be_project_swp.Core.Dtos.RequestOrder;

namespace be_artwork_sharing_platform.Core.Dtos.RequestOrder
{
    public class RequestOrderDto
    {
        public long Id { get; set; }
        public string NickName_Sender { get; set; }
        public string NickName_Receivier { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsSendResult { get; set; }
        public bool IsPayment { get; set; }
        public string Text_Result { get; set; }
        public string Url_Image { get; set; }
        public double Price { get; set; }
        public StatusRequest StatusRequest { get; set; }
    }
}
