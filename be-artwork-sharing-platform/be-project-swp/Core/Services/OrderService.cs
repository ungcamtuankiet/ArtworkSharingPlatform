using be_artwork_sharing_platform.Core.DbContext;
using be_project_swp.Core.Dtos.Order;
using be_project_swp.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace be_project_swp.Core.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GetResultAfterPayment> GetBill(long id)
        {
            var orderBill = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
            var bill = new GetResultAfterPayment()
            {
                Artwork_Id = orderBill.Artwork_Id,
                Url_Image = orderBill.Url_Image,
                Name_Artwork = orderBill.Name_Artwork,
                NickName_Buyer = orderBill.NickName_Buyer,
                NickName_Seller = orderBill.NickName_Seller,
                Date_Payment = orderBill.CreatedAt,
                Category_Artwork = orderBill.Category_Artwork,
                Price = orderBill.Price
            };
            return bill;
        }

        public async Task<IEnumerable<GetPaymentHistory>> GetPaymentHistory(string user_Id)
        {
            var historyPayments = await _context.Orders.Where(o => o.User_Id == user_Id)
                .Select(o => new GetPaymentHistory()
                {
                    Name_Artwork = o.Name_Artwork,
                    NickNme_Buyer = o.NickName_Buyer,
                    NickName_Seller = o.NickName_Seller,
                    Url_Image = o.Url_Image,
                    Price = o.Price,
                    Purchase_Date = o.CreatedAt
                }).ToListAsync();
            return historyPayments;
        }

        public async Task<IEnumerable<GetPaymentHistory>> GetMineOrder(string nick_Name)
        {
            var orders = await _context.Orders.Where(o => o.NickName_Seller == nick_Name)
                .Select(o => new GetPaymentHistory()
                {
                    Name_Artwork = o.Name_Artwork,
                    NickNme_Buyer = o.NickName_Buyer,
                    NickName_Seller = o.NickName_Seller,
                    Url_Image = o.Url_Image,
                    Price = o.Price,
                    Purchase_Date = o.CreatedAt
                }).ToListAsync();
            return orders;
        }

        public async Task<IEnumerable<GetBillForAdmin>> GetUserRevenue()
        {
            var orders = await _context.Orders
                .Select(o => new GetBillForAdmin()
                {
                    NickNme_Buyer = o.NickName_Buyer,
                    NickName_Seller = o.NickName_Seller,
                    Name_Artwork = o.Name_Artwork,
                    Url_Image = o.Url_Image,
                    Purchase_Date = o.CreatedAt,
                    Price= o.Price,
                })
                .OrderBy(o =>o.NickNme_Buyer)
                .ToListAsync();
            return orders;
        }

        public async Task<GetResultAfterRequestPayment> GetBillRequest(long id)
        {
            var requestBill = await _context.OrderDetails.FirstOrDefaultAsync(o => o.Id == id);
            var bill = new GetResultAfterRequestPayment()
            {
                NickName_Receivier = requestBill.NickName_Receivier,
                Url_Image = requestBill.Url_Image,
                Price = requestBill.Price,
                Text_Result = requestBill.Text,
                Date_Purchased = requestBill.CreatedAt
            };
            return bill;
        }
    }
}
