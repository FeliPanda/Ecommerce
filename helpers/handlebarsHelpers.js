import Handlebars from 'handlebars';

Handlebars.registerHelper('range', (start, end) => {
    let range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
});

Handlebars.registerHelper('ifEquals', (arg1, arg2, options) => {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

export default Handlebars;
