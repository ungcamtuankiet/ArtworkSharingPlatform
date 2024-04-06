namespace be_artwork_sharing_platform.Core.Dtos.RequestOrder
{
    public class ReceiveRequestDto
    {
        public long Id { get; set; }
        public string NickName_Sender { get; set; }
        public string Email_Sender { get; set; }
        public string PhoneNo_Sender { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public string StatusRequest { get; set; }
    }
}
