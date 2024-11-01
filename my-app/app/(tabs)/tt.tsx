import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, FlatList, TouchableOpacity, TextInput, Alert, Picker } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const App = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { cart, quantities, setCart } = route.params;

    const user = {
        name: 'Nguyễn Văn A',
        phone: '037***3445',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        avatar: require('../../assets/images/dcc.png'),
    };

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [selectedBank, setSelectedBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

    useEffect(() => {
        const fetchBanks = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api.vietqr.io/v2/banks');
                const result = await response.json();

                if (response.ok && result.code === "00") {
                    setBanks(result.data); // Lấy dữ liệu ngân hàng từ trường `data`
                } else {
                    alert("Lỗi khi lấy ngân hàng: " + (result.desc || "Lỗi không xác định"));
                }
            } catch (error) {
                alert("Lỗi mạng: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBanks();
    }, []);

    const calculateTotal = () => {
        return cart.reduce((total, product) => {
            return total + (product.price * (quantities[product.id] || 1));
        }, 0);
    };

    const total = calculateTotal();

    const handlePlaceOrder = () => {
        if (paymentMethod === 'cash') {
            alert("Đặt hàng thành công!");
            resetCart();
            setCart([]); // Đặt lại giỏ hàng
        } else if (paymentMethod === 'bank') {
            if (selectedBank && accountNumber) {
                setShowOtpInput(true);
            } else {
                alert("Vui lòng chọn ngân hàng và nhập số tài khoản.");
            }
        }
    };

    const resetCart = () => {
        navigation.navigate('gh'); // Quay lại trang giỏ hàng
    };

    const handleLinkBank = () => {
        const hardcodedOtp = '123456'; // Mã OTP cố định
        if (otp === hardcodedOtp) {
            alert("Giỏ hàng của bạn đã được đặt.");
            resetCart();
            setCart([]); // Đặt lại giỏ hàng
        } else {
            alert("Mã OTP không chính xác.");
        }
    };

    const renderProduct = ({ item }) => {
        const itemTotal = item.price * (quantities[item.id] || 1);
        return (
<View style={styles.productItem}>
                <Image source={item.image} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price.toLocaleString()} VND</Text>
                    <Text style={styles.quantityText}>Số lượng: {quantities[item.id] || 1}</Text>
                    <Text style={styles.itemTotalText}>Thành tiền: {itemTotal.toLocaleString()} VND</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../assets/images/back.png')} style={styles.icon} />
                <Text style={styles.headerTitle}>Thanh Toán</Text>
            </View>

            <View style={styles.userInfoContainer}>
                <Image source={user.avatar} style={styles.userAvatar} />
                <View style={styles.userInfoTextContainer}>
                    <Text style={styles.userInfoTextBold}>{user.name}</Text>
                    <Text style={styles.userInfoText}>{user.phone}</Text>
                    <Text style={styles.userInfoText}>{user.address}</Text>
                </View>
            </View>

            <FlatList
                data={cart}
                renderItem={renderProduct}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.productList}
            />

            <View style={styles.paymentMethodContainer}>
                <Text style={styles.paymentMethodTitle}>Chọn phương thức thanh toán:</Text>
                <TouchableOpacity onPress={() => setPaymentMethod('cash')} style={styles.paymentButton}>
                    <Text style={styles.paymentButtonText}>Tiền mặt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPaymentMethod('bank')} style={styles.paymentButton}>
                    <Text style={styles.paymentButtonText}>Ngân hàng</Text>
                </TouchableOpacity>
            </View>

            {paymentMethod === 'bank' && (
                <View style={styles.bankForm}>
                    <Picker
                        selectedValue={selectedBank}
                        onValueChange={(itemValue) => setSelectedBank(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Chọn ngân hàng" value="" />
                        {loading ? (
                            <Picker.Item label="Đang tải ngân hàng..." value="" />
                        ) : (
                            banks.length > 0 ? (
                                banks.map((bank) => (
                                    <Picker.Item key={bank.id} label={bank.shortName} value={bank.id} />
                                ))
                            ) : (
<Picker.Item label="Không có ngân hàng nào" value="" />
                            )
                        )}
                    </Picker>
                    <TextInput
                        placeholder="Số tài khoản"
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={handlePlaceOrder} style={styles.linkButton}>
                        <Text style={styles.linkButtonText}>Liên kết tài khoản</Text>
                    </TouchableOpacity>
                </View>
            )}

            {showOtpInput && (
                <View style={styles.otpContainer}>
                    <TextInput
                        placeholder="Nhập mã OTP"
                        value={otp}
                        onChangeText={setOtp}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={handleLinkBank} style={styles.otpButton}>
                        <Text style={styles.otpButtonText}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Tổng: {total.toLocaleString()} VND</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={handlePlaceOrder}>
                    <Text style={styles.buttonText}>Đặt Hàng</Text>
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
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    icon: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userInfoTextContainer: {
        flex: 1,
    },
    userInfoText: {
        fontSize: 14,
        color: '#666',
    },
    userInfoTextBold: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    productList: {
        paddingBottom: 10,
    },
    productItem: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        elevation: 1,
    },
productImage: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    productPrice: {
        fontSize: 14,
        color: '#666',
    },
    quantityText: {
        fontSize: 14,
        color: '#999',
    },
    itemTotalText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    paymentMethodContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    paymentMethodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    paymentButton: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginVertical: 5,
        alignItems: 'center',
    },
    paymentButtonText: {
        fontSize: 16,
        color: '#333',
    },
    bankForm: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
    linkButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    linkButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    otpContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    otpButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    otpButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    footer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    totalContainer: {
        padding: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    checkoutButton: {
        padding: 15,
        backgroundColor: '#28a745',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default App;