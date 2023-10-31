import moment from "moment/moment";

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

export function chuyenNgay(ngay) {
    const dateTimeString = ngay;
    const dateTime = new Date(dateTimeString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateTime.toLocaleDateString(undefined, options);
    return formattedDate
}

export function capitalizeFirstLetter(chuoi) {
    // Kiểm tra nếu chuỗi là rỗng hoặc null
    if (!chuoi) {
        return chuoi;
    }
    // Lấy kí tự đầu tiên và chuyển thành chữ cái viết hoa
    var kyTuDau = chuoi.charAt(0).toUpperCase();
    // Lấy phần còn lại của chuỗi
    var phanConLai = chuoi.slice(1);
    // Kết hợp kí tự đầu viết hoa và phần còn lại của chuỗi
    var chuoiVietHoa = kyTuDau + phanConLai;
    return chuoiVietHoa;
}

export function convertMsToMinSec(ms) {
    const minutes = Math.floor(ms / 60000); // Một phút có 60000 miligiây
    const seconds = ((ms % 60000) / 1000).toFixed(0); // Lấy phần dư và chuyển thành giây

    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
}

export function getTimeDifference(dateString) {
    const inputDate = moment(dateString, 'MMMM DD, YYYY');
    const currentDate = moment();
    const daysDifference = currentDate.diff(inputDate, 'days');
  
    if (daysDifference > 7) {
      return dateString;
    } else {
      return daysDifference === 0 ? 'today' : daysDifference === 1 ? 'yesterday' : `${daysDifference} days ago`;
    }
}