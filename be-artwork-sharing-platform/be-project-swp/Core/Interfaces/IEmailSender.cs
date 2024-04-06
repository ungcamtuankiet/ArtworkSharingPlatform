using be_project_swp.Core.Dtos.Email;

namespace be_project_swp.Core.Interfaces
{
    public interface IEmailSender
    {
        void SendEmail(Message message);
    }
}
