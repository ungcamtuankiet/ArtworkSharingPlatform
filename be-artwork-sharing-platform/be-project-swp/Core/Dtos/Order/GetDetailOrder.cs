namespace be_project_swp.Core.Dtos.Order;

public class GetResultAfterPayment
{
    public string Url_Image { get; set; }
    public long Artwork_Id { get; set; }
    public string Name_Artwork { get; set; }
    public string NickName_Buyer { get; set; }
    public string NickName_Seller { get; set; }
    public DateTime Date_Payment { get; set; }
    public string Category_Artwork { get; set; }
    public double Price { get; set; }
}

public class GetPaymentHistory
{
    public string Name_Artwork { get; set; }
    public string NickNme_Buyer { get; set; }
    public string NickName_Seller { get; set; }
    public string Url_Image { get; set; }
    public double Price { get; set; }
    public DateTime Purchase_Date { get; set; }
}

public class GetBillForAdmin
{
    public string NickNme_Buyer { get; set; }
    public string NickName_Seller { get; set; }
    public string Name_Artwork { get; set; }
    public string Url_Image { get; set; }
    public DateTime Purchase_Date { get; set; }
    public double Price { get; set; }
}