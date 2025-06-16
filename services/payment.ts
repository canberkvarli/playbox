export interface PaymentProvider {
  name: string;
  processPayment(amount: number): Promise<boolean>;
}

export class IyzicoProvider implements PaymentProvider {
  name = "Iyzico";

  async processPayment(amount: number): Promise<boolean> {
    console.log("Processing payment with Iyzico:", amount);
    // Implementation will be added
    return true;
  }
}

export class PayTRProvider implements PaymentProvider {
  name = "PayTR";

  async processPayment(amount: number): Promise<boolean> {
    console.log("Processing payment with PayTR:", amount);
    // Implementation will be added
    return true;
  }
}
