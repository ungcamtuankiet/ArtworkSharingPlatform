namespace be_artwork_sharing_platform.Core.Dtos.Favourite
{
    public class AddFavourite
    {
        public bool IsSucceed { get; set; }
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public long Favourite_Id { get; set; }
    }
}
