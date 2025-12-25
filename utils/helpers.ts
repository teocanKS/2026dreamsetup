export const statusMap: Record<string, string> = {
    active: 'Aktif',
    planned: 'Planlanan',
    bought: 'Alındı',
    archived: 'Arşivlendi'
}

export const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('tr-TR')} ₺`
}

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export const productImages: Record<string, string> = {
    'ASUS ROG Astral RTX 5080 WHITE OC': 'https://img-itopya.mncdn.com/cdn/1000/4-f245cb.png',
    'AMD Ryzen 9 9950X3D': 'https://m.media-amazon.com/images/I/71hZfMZNZuL._AC_SX679_.jpg',
    'Kingston FURY Beast RGB 64GB DDR5 6000 CL30': 'https://m.media-amazon.com/images/I/41KFvrOrj8L._AC_SX679_.jpg',
    'ASUS ROG STRIX X870-A GAMING WIFI': 'https://m.media-amazon.com/images/I/81qHDArHfWL._AC_SL1500_.jpg',
    'ASUS ROG RYUJIN III 360 ARGB EXTREME White': 'https://img-itopya.mncdn.com/cdn/1000/yeni-proje-993c85.jpg',
    'Kingston Renegade 2TB Gen5': 'https://img-itopya.mncdn.com/cdn/1000/3-0f6d30.png',
    'ROG Strix OLED XG27ACDNG': 'https://m.media-amazon.com/images/I/91aSvRS9+RL._AC_SL1500_.jpg',
    'ASUS ROG Thor': 'https://m.media-amazon.com/images/I/814nsveacVL._AC_SL1500_.jpg',
    'SteelSeries Apex Pro TKL Gen 3 White UK': 'https://cdn.dsmcdn.com/ty1647/prod/QC/20250311/12/3d42a610-cdde-354c-b6e6-a83bbad3f950/1_org_zoom.jpg',
    'FortiGate 60F': 'https://m.media-amazon.com/images/I/616WSlOiycL._AC_UF1000,1000_QL80_.jpg',
    'FortiSwitch': 'https://m.media-amazon.com/images/I/61Nu3-p0x8L._AC_SX466_.jpg',
    'NZXT H5 FLOW RGB White': 'https://static.sinerji.gen.tr/Images/MD/5EQ-yeni-proje-c35bce.jpg'
}

export const getProductImage = (model: string): string => {
    for (const [key, url] of Object.entries(productImages)) {
        if (model?.includes(key) || key.includes(model)) {
            return url
        }
    }
    return ''
}
