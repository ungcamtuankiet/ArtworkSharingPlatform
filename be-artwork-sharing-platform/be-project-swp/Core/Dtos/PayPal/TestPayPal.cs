namespace be_project_swp.Core.Dtos.PayPal;

public class ApplicationSettings
{
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
}

public class PaypalConfiguration_1
{
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
}

public class PaypalPayment
{
    public PaypalPayment()
    {
        ProductList = new List<PayPalProduct>();
    }

    public List<PayPalProduct> ProductList { get; set; }
    public string SiteURL { get; set; }
    public string InvoiceNumber { get; set; }
    public string Currency { get; set; }
    public string Tax { get; set; }
    public string ShippingFee { get; set; }
    public string OrderDescription { get; set; }

    public string PayerID { get; set; }
    public string PaymentID { get; set; }
    public string Token { get; set; }

    public int? Count { get; set; }
    public string StartID { get; set; }
    public int? StartIndex { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string StartDate { get; set; }
    public string PayeeEmail { get; set; }
    public string PayeeID { get; set; }
    public string SortBy { get; set; }
    public string SortOrder { get; set; }
}

public class PayPalProduct
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double UnitPrice { get; set; }
    public string SKU { get; set; }
    public int OrderQty { get; set; }
    public string CurrencyCode { get; set; }
    public double Tax { get; set; }
    public double ShippingFee { get; set; }
    public string ReturnUrl { get; set; }
}

public class ServiceResponse<T>
{
    public Boolean Success;
    public String Message;
    public T Response;
    public Exception Error;
}
