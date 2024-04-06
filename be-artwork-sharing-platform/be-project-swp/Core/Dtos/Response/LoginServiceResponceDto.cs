using be_artwork_sharing_platform.Core.Dtos.User;

namespace be_project_swp.Core.Dtos.Response
{
    public class LoginServiceResponceDto
    {
        public string NewToken { get; set; }

        //This would be returned to front-end
        public UserInfoResult UserInfo { get; set; }
    }
}
