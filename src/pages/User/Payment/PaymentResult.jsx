import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const status = searchParams.get('status'); // PAID, CANCELLED
    const orderCode = searchParams.get('orderCode');
    const isSuccess = status === 'PAID';

    useEffect(() => {
        if (status) {
            if (isSuccess) {
                toast.success('Thanh toán thành công!');
            } else {
                toast.error('Thanh toán thất bại hoặc đã bị hủy.');
            }
        }
    }, [status, isSuccess]);

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-center">
                <Card className="shadow-sm border-0 rounded-4 p-4 text-center" style={{ maxWidth: '500px', width: '100%' }}>
                    <div className="mb-4">
                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${isSuccess ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`} style={{ width: '80px', height: '80px' }}>
                            <i className={`bi ${isSuccess ? 'bi-check-lg text-success' : 'bi-x-lg text-danger'}`} style={{ fontSize: '40px' }}></i>
                        </div>
                    </div>
                    
                    <h3 className={`fw-bold mb-3 ${isSuccess ? 'text-success' : 'text-danger'}`}>
                        {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                    </h3>
                    
                    <p className="text-muted mb-4">
                        {isSuccess 
                            ? `Cảm ơn bạn đã sử dụng dịch vụ. Mã đơn hàng của bạn là #${orderCode}.`
                            : 'Giao dịch của bạn chưa được hoàn tất hoặc đã bị hủy. Vui lòng thử lại.'}
                    </p>

                    <div className="d-grid gap-3">
                        {isSuccess ? (
                            <Button 
                                variant="primary" 
                                className="fw-bold py-2 rounded-3"
                                onClick={() => navigate('/setting?tab=history')}
                            >
                                Xem lịch sử đặt chỗ
                            </Button>
                        ) : (
                            <Button 
                                variant="primary" 
                                className="fw-bold py-2 rounded-3"
                                onClick={() => navigate('/')}
                            >
                                Về trang chủ
                            </Button>
                        )}
                        
                        <Button 
                            variant="outline-secondary" 
                            className="fw-bold py-2 rounded-3"
                            onClick={() => navigate('/')}
                        >
                            Trang chủ
                        </Button>
                    </div>
                </Card>
            </div>
        </Container>
    );
};

export default PaymentResult;
