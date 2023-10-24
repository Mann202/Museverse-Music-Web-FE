export function formatNumber(number) {
    // Chuyển số thành chuỗi và tách phần nguyên và phần thập phân (nếu có)
    var parts = number.toString().split('.');
    var integerPart = parts[0];
    var decimalPart = parts[1] ? '.' + parts[1] : '';

    // Đặt dấu chấm ở các vị trí thích hợp trong phần nguyên
    if (integerPart.length > 3) {
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Kết hợp phần nguyên và phần thập phân để tạo chuỗi kết quả
    var formattedNumber = integerPart + decimalPart;
    return formattedNumber;
}

export function chuyenDoiThoiGian(ms) {
    var phut = Math.floor((ms / (1000 * 60)) % 60); // Lấy phần dư khi chia cho 3600, sau đó chia cho 60 để lấy số phút
    var gio = Math.floor(ms / (1000 * 60 * 60)); 

    return gio + " giờ " + phut + " phút "
}