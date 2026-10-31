import { Lesson } from './lessons.model';
import { MODULE_1 } from './data/module-1';
import { MODULE_2 } from './data/module-2';
import { MODULE_3 } from './data/module-3';
import { MODULE_4 } from './data/module-4';
import { MODULE_5 } from './data/module-5';

export const LESSONS: Lesson[] = [...MODULE_1, ...MODULE_2, ...MODULE_3, ...MODULE_4, ...MODULE_5];
