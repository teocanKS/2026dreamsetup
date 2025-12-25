export const statusMap: Record<string, string> = {
    active: 'Aktif',
    planned: 'Planlanan',
    bought: 'Alındı',
    archived: 'Arşivlendi'
}

export const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₺`
}

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export const productImages: Record<string, string> = {
    'RTX 5080': 'https://img-itopya.mncdn.com/cdn/1000/4-f245cb.png',
    'GPU': 'https://img-itopya.mncdn.com/cdn/1000/4-f245cb.png',
    '9950X3D': 'https://m.media-amazon.com/images/I/71hZfMZNZuL._AC_SX679_.jpg',
    'CPU': 'https://m.media-amazon.com/images/I/71hZfMZNZuL._AC_SX679_.jpg',
    'Kingston FURY': 'https://m.media-amazon.com/images/I/41KFvrOrj8L._AC_SX679_.jpg',
    'RAM': 'https://m.media-amazon.com/images/I/41KFvrOrj8L._AC_SX679_.jpg',
    'X870': 'https://m.media-amazon.com/images/I/81qHDArHfWL._AC_SL1500_.jpg',
    'ANAKART': 'https://m.media-amazon.com/images/I/81qHDArHfWL._AC_SL1500_.jpg',
    'RYUJIN': 'https://img-itopya.mncdn.com/cdn/1000/yeni-proje-993c85.jpg',
    'SOGUTMA': 'https://img-itopya.mncdn.com/cdn/1000/yeni-proje-993c85.jpg',
    'Renegade': 'https://img-itopya.mncdn.com/cdn/1000/3-0f6d30.png',
    'SSD': 'https://img-itopya.mncdn.com/cdn/1000/3-0f6d30.png',
    'XG27ACDNG': 'https://m.media-amazon.com/images/I/91aSvRS9+RL._AC_SL1500_.jpg',
    'MONITOR': 'https://m.media-amazon.com/images/I/91aSvRS9+RL._AC_SL1500_.jpg',
    'Thor': 'https://m.media-amazon.com/images/I/814nsveacVL._AC_SL1500_.jpg',
    'PSU': 'https://m.media-amazon.com/images/I/814nsveacVL._AC_SL1500_.jpg',
    'Apex Pro': 'https://cdn.dsmcdn.com/ty1647/prod/QC/20250311/12/3d42a610-cdde-354c-b6e6-a83bbad3f950/1_org_zoom.jpg',
    'KLAVYE': 'https://cdn.dsmcdn.com/ty1647/prod/QC/20250311/12/3d42a610-cdde-354c-b6e6-a83bbad3f950/1_org_zoom.jpg',
    'FortiGate': 'https://m.media-amazon.com/images/I/616WSlOiycL._AC_UF1000,1000_QL80_.jpg',
    'FIREWALL': 'https://m.media-amazon.com/images/I/616WSlOiycL._AC_UF1000,1000_QL80_.jpg',
    'FortiSwitch': 'https://m.media-amazon.com/images/I/61Nu3-p0x8L._AC_SX466_.jpg',
    'SWITCH': 'https://m.media-amazon.com/images/I/61Nu3-p0x8L._AC_SX466_.jpg',
    'H5 FLOW': 'https://static.sinerji.gen.tr/Images/MD/5EQ-yeni-proje-c35bce.jpg',
    'KASA': 'https://static.sinerji.gen.tr/Images/MD/5EQ-yeni-proje-c35bce.jpg'
}

export const getProductImage = (category: string, model: string): string => {
    const searchText = `${category} ${model}`.toUpperCase()

    for (const [key, url] of Object.entries(productImages)) {
        if (searchText.includes(key.toUpperCase())) {
            return url
        }
    }

    return ''
}

export const applyDiscount = (basePrice: number, category: string, discountPercent: number = 0): number => {
    const isDiscountable = category?.toUpperCase().includes('FIREWALL') || category?.toUpperCase().includes('SWITCH')
    if (isDiscountable && discountPercent > 0) {
        return basePrice * (1 - discountPercent / 100)
    }
    return basePrice
}
