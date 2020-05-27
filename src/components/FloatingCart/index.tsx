import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useCart } from '../../hooks/cart';
import formatValue from '../../utils/formatValue';
import {
  CartButton,
  CartButtonText,
  CartPricing,
  CartTotalPrice,
  Container,
} from './styles';

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const totalPrice = products.reduce((accumulator, { price, quantity }) => {
      return accumulator + price * quantity;
    }, 0);
    return formatValue(totalPrice);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const totalItens = products.reduce((accumulator, { quantity }) => {
      return accumulator + quantity;
    }, 0);
    return totalItens;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
