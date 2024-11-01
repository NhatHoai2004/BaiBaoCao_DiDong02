import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const banners = [
  { id: '1', image: require('../../assets/images/banner.jpg') },
  { id: '2', image: require('../../assets/images/banner2.jpg') },
];

const categories = [
  { id: '1', name: 'Gấu Bông Lớn', image: require('../../assets/images/capi.png') },
  { id: '2', name: 'Gấu Bông Nhỏ', image: require('../../assets/images/me.jpg') },
  { id: '3', name: 'Gấu Bông Ngồi', image: require('../../assets/images/meo.jpg') },
  { id: '4', name: 'Gấu Bông Nằm', image: require('../../assets/images/cun.jpg') },
];

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]); // Initialize with an empty array
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigation = useNavigation(); // Khởi tạo navigation

  useEffect(() => {
    // Fetch products on component mount
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/data');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initialize filteredProducts with all products
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchProducts();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(text.toLowerCase()) &&
        (!selectedCategory || product.categoryId === selectedCategory)
      );
      setFilteredProducts(filtered);
    } else {
      filterProductsByCategory(selectedCategory);
    }
  };

  const filterProductsByCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      const filtered = products.filter(product => product.categoryId === categoryId);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Show all products if no category is selected
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/h.png')} style={styles.icon} />
        <View style={styles.rightIcons}>
          <Image source={require('../../assets/images/a.png')} style={styles.icon} />
          <TouchableOpacity onPress={() => navigation.navigate('gh')}>
          <Image source={require('../../assets/images/ca.png')} style={styles.icon} />
          </TouchableOpacity>
          <Image source={require('../../assets/images/t.png')} style={styles.icon} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image source={require('../../assets/images/s.png')} style={styles.searchButtonImage} />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <FlatList
          data={banners}
          renderItem={({ item }) => <Image source={item.image} style={styles.bannerImage} />}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={360}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>Danh Mục</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={() => filterProductsByCategory(null)}>
            <Text style={styles.viewAllText}>Xem Tất Cả</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => filterProductsByCategory(item.id)}>
              <View style={styles.categoryItem}>
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Products */}
      <View style={styles.productContainer}>
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.productItem} 
              onPress={() => navigation.navigate('ct', { product: item })} // Chuyển tới trang chi tiết
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productName}>{item.title}</Text>
              <Text style={styles.productPrice}>{item.price} VNĐ</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
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
  },
  rightIcons: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  searchButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9900',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  searchButtonImage: {
    width: 20,
    height: 20,
  },
  bannerContainer: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: 360,
    height: 150,
    borderRadius: 10,
  },
  categoryContainer: {
    margin: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryItem: {
    padding: 1,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    width: 100,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 16,
    textAlign: 'center',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewAllText: {
    fontSize: 16,
    color: '#FF9900',
  },
  productContainer: {
    flex: 1,
    margin: 10,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    flex: 1,
    margin: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#FF9900',
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default App; 