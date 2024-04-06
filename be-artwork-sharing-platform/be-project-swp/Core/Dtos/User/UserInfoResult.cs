namespace be_artwork_sharing_platform.Core.Dtos.User;
public class UserInfoResult
{
    public string Id { get; set; }
    public string NickName { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Address { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<string> Roles { get; set; }
}


