// dom 操作相关方法

// 轮播图动态添加样式
export function addClass(el, className) {
    if (hasClass(el, className)) return;

    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
}
// 判断是否有对应的className
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
}