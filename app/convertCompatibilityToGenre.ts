export type CompatibilityAnswers = {
    mood: '気軽に' | '奮発';
    uniqueness: 'はい' | 'うーん';
    calmness: 'はい' | 'うーん';
    photogenic: 'はい' | 'うーん';
};

/**
 * Compatibility診断の回答からジャンルを決める関数
 */
export const convertCompatibilityToGenre = (answers: CompatibilityAnswers): string => {
    const { mood, uniqueness, calmness, photogenic } = answers;

    // ルールは自由に調整可能
    if (mood === '気軽に' && uniqueness === 'はい' && calmness === 'はい') return 'カフェ';
    if (mood === '奮発' && uniqueness === 'うーん' && photogenic === 'はい') return '居酒屋';
    if (mood === '奮発' && uniqueness === 'はい') return '洋食';
    if (mood === '気軽に' && calmness === 'うーん') return 'ファストフード';

    // どれにも当てはまらない場合は「その他」
    return 'その他';
};
