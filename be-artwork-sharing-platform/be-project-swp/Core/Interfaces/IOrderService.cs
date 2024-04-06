using be_project_swp.Core.Dtos.Order;

namespace be_project_swp.Core.Interfaces
{
    public interface IOrderService
    {
        Task<GetResultAfterPayment> GetBill(long id);
        Task<IEnumerable<GetPaymentHistory>> GetPaymentHistory(string user_Id);
        Task<IEnumerable<GetPaymentHistory>> GetMineOrder(string nick_Name);
        Task<IEnumerable<GetBillForAdmin>> GetUserRevenue();
        Task<GetResultAfterRequestPayment> GetBillRequest(long id);
    }
}
