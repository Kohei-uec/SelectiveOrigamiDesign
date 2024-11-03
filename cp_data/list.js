export const list = {
    top: [
        'default.cp',
        'none.cp',
        'normal1.cp',
        'normal2.cp',
        'prism.cp',
        'triangle.cp',
        'simpleS.cp',
        'simpleM.cp',
        'simpleL.cp',
        'worried.cp',
        'thin.cp',
    ],
    bottom: ['default.cp', 'triangle.cp', 'smile.cp', 'rect.cp', 'sharp.cp', 'thin.cp', 'small.cp', 'Jagged_teeth.cp'],
    side: [
        'default.cp',
        'simple.cp',
        'circle.cp',
        'heart.cp',
        'arrow1.cp',
        'arrow2.cp',
        'arrow3.cp',
        'arrow4.cp',
        'arrow5.cp',
        'rect1.cp',
        'rect2.cp',
        'thin1.cp',
        'thin2.cp',
        'dia.cp',
        'zigzag.cp',
    ],
};

//preview option
export function getOptions(part, fileName) {
    return {
        reverse: options_list.reverse[part].includes(fileName),
        order: options_list.order[part][fileName] ?? 0,
    };
}
const options_list = {
    reverse: {
        top: ['none.cp'],
        bottom: ['triangle.cp', 'smile.cp', 'rect.cp', 'sharp.cp', 'thin.cp', 'small.cp', 'Jagged_teeth.cp'],
        left: [],
        right: [
            'simple.cp',
            'arrow1.cp',
            'arrow2.cp',
            'arrow3.cp',
            'arrow4.cp',
            'arrow5.cp',
            'rect1.cp',
            'rect2.cp',
            'thin1.cp',
            'thin2.cp',
            'dia.cp',
            'zigzag.cp',
        ],
    },
    order: {
        top: {
            'normal1.cp': 2,
            'normal2.cp': 2,
            'prism.cp': 2,
            'triangle.cp': 2,
            'simpleS.cp': 2,
            'simpleM.cp': 2,
            'simpleL.cp': 2,
            'worried.cp': 2,
            'thin.cp': 2,
        },
        bottom: {
            'smile.cp': 1,
            'rect.cp': 1,
            'thin.cp': 1,
            'small.cp': 1,
        },
        left: {},
        right: {},
    },
};
