namespace be_project_swp.Core.Dtos.PayPal;
public class PaymentInformationModel
{
    public string OrderType { get; set; }
    public double Amount { get; set; }
    public string OrderDescription { get; set; }
    public string Name { get; set; }

}

public class PaymentResponseModel
{
    public string OrderDescription { get; set; }
    public string TransactionId { get; set; }
    public string OrderId { get; set; }
    public string PaymentMethod { get; set; }
    public string PaymentId { get; set; }
    public string PayerId { get; set; }
    public bool Success { get; set; }
}

public class ErrorViewModel
{
    public string? RequestId { get; set; }

    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
}


