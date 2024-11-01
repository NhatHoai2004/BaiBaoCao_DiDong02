import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const Detail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [productId, setProductId] = useState(route.params?.product.id);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [cart, setCart] = useState([]); // Trạng thái giỏ hàng

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch('http://localhost:3000/data');
                const data = await response.json();

                const foundProduct = data.find(item => item.id === productId);
                setProduct(foundProduct);

                if (foundProduct) {
                    const sameCategoryProducts = data.filter(
                        item => item.category === foundProduct.category && item.id !== productId
                    );
                    setRelatedProducts(sameCategoryProducts);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            }
        };

        fetchProductData();

        // Load cart from localStorage when the component mounts
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, [productId]);

    if (!product) {
        return (
            <View style={styles.container}>
                <Text>Sản phẩm không tồn tại.</Text>
            </View>
        );
    }

    const handleAddToCart = () => {
        const existingProduct = cart.find(item => item.id === product.id);
        
        let updatedCart;

        if (existingProduct) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
            updatedCart = cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            );
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            updatedCart = [...cart, { ...product, quantity }];
        }
        
        setCart(updatedCart);

        // Lưu vào localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        alert('Đã thêm vào giỏ hàng!');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('trangchu')}>
                    <Image source={require('../../assets/images/back.png')} style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.rightIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate('gh')}>
                        <Image source={require('../../assets/images/ca.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.bottomImage} resizeMode="contain" />
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productPrice}>{product.price} VNĐ</Text>
                <Text style={styles.quantityLabel}>Số lượng</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setQuantity(prev => Math.max(prev - 1, 1))}
                    >
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setQuantity(prev => prev + 1)}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.productName}>{product.title}</Text>
                <Text style={styles.productRating}>⭐ 4.5 (20 đánh giá)</Text>
                <Text style={styles.productSold}>Đã bán: 150 cái</Text>
                <Text style={styles.productIntro}>Giới thiệu: Một người bạn đáng yêu cho mọi lứa tuổi!</Text>
                <Text style={styles.productDetails}>Chi tiết: {product.description}</Text>
            </View>

            {/* Sản Phẩm Liên Quan */}
            <View style={styles.productContainer}>
                <Text style={styles.relatedProductsTitle}>Sản phẩm liên quan</Text>
                <FlatList
                    data={relatedProducts}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.productItem} 
                            onPress={() => setProductId(item.id)} // Cập nhật productId với ID của sản phẩm liên quan
                        >
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <Text style={styles.productName}>{item.title}</Text>
                            <Text style={styles.productPrice}>{item.price} VNĐ</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()} // Đảm bảo keyExtractor là một chuỗi
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
                    <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => alert('Sử dụng Voucher')}>
                    <Text style={styles.buttonText}>Mua Với Voucher</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        elevation: 3,
    },
    rightIcons: {
        flexDirection: 'row',
    },
    icon: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
    },
    imageContainer: {
        width: '95%',
        marginTop: 20,
        borderRadius: 15,
        overflow: 'hidden',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    bottomImage: {
        width: '100%',
        height: 200,
    },
    productInfo: {
        padding: 10,
        alignItems: 'flex-start',
        marginTop: 10,
    },
    productPrice: {
        fontSize: 19,
        color: '#FF9900',
    },
    productName: {
        fontSize: 18,
        color: '#333',
        marginTop: 5,
    },
    productRating: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    productSold: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    productIntro: {
        fontSize: 16,
        color: '#333',
        fontStyle: 'italic',
        marginTop: 5,
    },
    productDetails: {
        fontSize: 16,
        color: '#333',
        marginTop: 5,
    },
    quantityLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#FF9900',
        borderRadius: 5,
        padding: 5,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    button: {
        flex: 1,
        backgroundColor: '#FF9900',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    productContainer: {
        flex: 1,
        margin: 10,
    },
    relatedProductsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    productItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 5,
        flex: 1,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    productImage: {
        width: 100,
        height: 100,
        marginBottom: 5,
    },
    row: {
        justifyContent: 'space-between',
    },
});

export default Detail;
