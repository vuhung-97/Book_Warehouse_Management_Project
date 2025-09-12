let array = [];

export const changeArray = (newArray) => {
    array = newArray;
};

/* 
*
*  Sắp xếp
* 
*/

export function setupSorting(headers, func) {
    let sortDirections = {};
    headers.forEach((header, index) => {
        header.addEventListener("click", () => {
            const currentDir = sortDirections[index] === "asc" ? "desc" : "asc";

            if (!header.querySelector('label')) return;

            const key = header.querySelector('label').dataset.key;

            if (!key) return;

            sortDirections[index] = currentDir;

            array.sort((a, b) => {
                let valA = a[key];
                let valB = b[key];

                // Xử lý giá trị null/undefined để đảm bảo chúng được sắp xếp đúng
                if (valA === null || valA === undefined) valA = (currentDir === "asc" ? Infinity : -Infinity);
                if (valB === null || valB === undefined) valB = (currentDir === "asc" ? Infinity : -Infinity);

                // Chuyển về chữ thường khi so sánh chuỗi
                if (typeof valA === 'string' && typeof valB === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA < valB) {
                    return currentDir === "asc" ? -1 : 1;
                }
                if (valA > valB) {
                    return currentDir === "asc" ? 1 : -1;
                }
                return 0;
            });

            func(array);
        });
    });
}
