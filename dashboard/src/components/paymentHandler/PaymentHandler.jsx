import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';
import { shopService } from '../../api/axios';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { usePoster } from '../../context/PosterContext';

const PaymentHandler = () => {

    const { cart } = usePoster()
    const amount = cart ? cart.price * 100 : 0; // Amount in paise
    const currency = "INR";
    const receiptId = `receipt_${Date.now()}`;

    
    return (
        <div className="payment-section">
            <button
                type="button"
                className={`payment-button ${!isFormValid ? 'disabledd' : ''}`}
                onClick={handlePayment}
                disabled={loading || !isFormValid}
            >
                {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <div className="security-note">
                <p>🔒 Your payment is secured with 256-bit SSL encryption</p>
            </div>
        </div>
    );
};

export default PaymentHandler;