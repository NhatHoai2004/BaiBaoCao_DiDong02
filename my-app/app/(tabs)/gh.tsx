//gh.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
    const navigation = useNavigation();
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [checkedProducts, setCheckedProducts] = useState({});

    useEffect(() => {
        const loadCart = async () => {
            const cartData = JSON.parse(localStorage.getItem('cart')) || [];
            setCart(cartData);

            const initialChecked = cartData.reduce((acc, product) => {
                acc[product.id] = true;
                return acc;
            }, {});
            setCheckedProducts(initialChecked);

            const initialQuantities = cartData.reduce((acc, product) => {
                acc[product.id] = product.quantity || 1;
                return acc;
            }, {});
            setQuantities(initialQuantities);
        };

        loadCart();
    }, []);

    const handleRemoveItem = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const updateQuantity = (id, delta) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) + delta, 1)
        }));
    };

    const toggleCheck = (id) => {
        setCheckedProducts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleSelectAll = () => {
        const allChecked = Object.values(checkedProducts).every(Boolean);
        const newChecked = cart.reduce((acc, product) => {
            acc[product.id] = !allChecked;
            return acc;
        }, {});
        setCheckedProducts(newChecked);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            if (checkedProducts[item.id]) {
                return total + (item.price * (quantities[item.id] || 1));
            }
            return total;
        }, 0);
    };

    const total = calculateTotal();

const handleCheckout = () => {
    navigation.navigate('tt', {
        cart: cart,
        quantities: quantities,
        setCart: setCart, // Thêm dòng này
    });
};

    const renderCartItem = ({ item }) => (
        <View style={styles.productItem}>
            <TouchableOpacity onPress={() => toggleCheck(item.id)} style={styles.checkbox}>
                <View style={[styles.circle, checkedProducts[item.id] && styles.checkedCircle]}>
                    {checkedProducts[item.id] && <Text style={styles.checkmark}>✔</Text>}
                </View>
            </TouchableOpacity>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
<Text style={styles.productName}>{item.title}</Text>
                <View style={styles.priceAndQuantity}>
                    <Text style={styles.productPrice}>{item.price.toLocaleString()} VND</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.id, -1)}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantities[item.id] || 1}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(item.id, 1)}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ct')}>
                <Image source={require('../../assets/images/back.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>Giỏ Hàng</Text>
            </View>
            {cart.length === 0 ? (
                <Text style={styles.emptyCart}>Giỏ hàng của bạn đang trống!</Text>
            ) : (
                <FlatList
                    data={cart}
                    renderItem={renderCartItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.productList}
                />
            )}
            <View style={styles.footer}>
                <TouchableOpacity onPress={toggleSelectAll} style={styles.selectAllContainer}>
                    <View style={[styles.circle, Object.values(checkedProducts).every(Boolean) && styles.checkedCircle]}>
                        {Object.values(checkedProducts).every(Boolean) && <Text style={styles.checkmark}>✔</Text>}
                    </View>
                    <Text style={styles.selectAllText}>Chọn tất cả</Text>
                </TouchableOpacity>
                
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Tổng: {total.toLocaleString()} VND</Text>
                </View>

                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.buttonText}>Thanh Toán</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
backgroundColor: '#f8f8f8',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    icon: {
        width: 30,
        height: 30,
    },
    productList: {
        padding: 10,
    },
    productItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    priceAndQuantity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    productPrice: {
        fontSize: 14,
        color: '#FF9900',
        marginRight: 10,
        flex: 1,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#FF9900',
        borderRadius: 5,
        padding: 4,
        marginHorizontal: 5,
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    checkbox: {
        marginRight: 10,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FF9900',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedCircle: {
        backgroundColor: '#FF9900',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    totalContainer: {
        flex: 1,
        alignItems: 'center',
    },
    checkoutButton: {
        backgroundColor: '#FF9900',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    totalText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FF9900',
        marginVertical: 10,
    },
    emptyCart: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
    },
    removeButton: {
        marginTop: 10,
    },
    removeButtonText: {
        color: '#FF0000',
    },
});

export default Cart;