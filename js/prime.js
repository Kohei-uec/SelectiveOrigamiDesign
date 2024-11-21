export function prime_factorize(number) {
    const ans = [];
    let p = 2;
    while (p ** 2 <= number) {
        if (number % p === 0) {
            ans.push(p);
            number /= p;
        } else {
            p++;
        }
    }
    if (number !== 1) {
        ans.push(number);
    }

    return ans;
}
