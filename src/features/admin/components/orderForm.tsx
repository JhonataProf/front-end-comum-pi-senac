// src/views/OrderForm.tsx
import withPageLayout from 'hoc/withPageLayout';
import OrderFormInner from './OrderFormInner';

const OrderForm = withPageLayout({
  title: 'Gestão de pedidos',
  subtitle: 'Crie ou edite pedidos com os dados do cliente e itens.',
})(OrderFormInner);

export default OrderForm;
