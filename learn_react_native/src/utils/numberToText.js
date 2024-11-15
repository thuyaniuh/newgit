// Chuyển đổi số thành chữ tiếng Việt
export function convertNumberToVietnameseText(number) {
    if (isNaN(number) || number < 0) return "Không hợp lệ";

    const units = ["", "nghìn", "triệu", "tỷ"];
    const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

    if (number === 0) return "không";

    let str = number.toString();
    let result = "";
    let groupIndex = 0;

    while (str.length > 0) {
        let group = str.slice(-3);
        str = str.slice(0, -3);

        let groupText = convertThreeDigitGroupToText(parseInt(group), digits);
        if (groupText) {
            result = groupText + (units[groupIndex] ? " " + units[groupIndex] : "") + " " + result;
        }
        groupIndex++;
    }

    return result.trim().replace(/\s+/g, " ");
}

function convertThreeDigitGroupToText(number, digits) {
    if (number === 0) return "";

    let hundreds = Math.floor(number / 100);
    let tens = Math.floor((number % 100) / 10);
    let ones = number % 10;
    let groupText = "";

    if (hundreds > 0) {
        groupText += digits[hundreds] + " trăm ";
    }

    if (tens > 1) {
        groupText += digits[tens] + " mươi ";
        if (ones === 1) {
            groupText += "mốt ";
        } else if (ones === 5) {
            groupText += "lăm ";
        } else if (ones > 0) {
            groupText += digits[ones] + " ";
        }
    } else if (tens === 1) {
        groupText += "mười ";
        if (ones === 5) {
            groupText += "lăm ";
        } else if (ones > 0) {
            groupText += digits[ones] + " ";
        }
    } else if (tens === 0 && ones > 0) {
        if (hundreds > 0) {
            groupText += "linh ";
        }
        if (ones === 5) {
            groupText += "lăm ";
        } else {
            groupText += digits[ones] + " ";
        }
    }

    return groupText.trim();
}
