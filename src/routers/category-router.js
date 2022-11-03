import { Router } from 'express';
import { categoryService } from '../services';
import { sanitizeObject } from '../utils/sanitizeObject';

const categoryRouter = Router();

// 카테고리 추가
categoryRouter.post('/', async (req, res, next) => {
  try {
    const { parent_category, child_category, species, species_code, species_image } = req.body;
    const DTO = { parent_category, child_category, species, species_code, species_image };

    const createdCategory = await categoryService.createCategory(DTO);
    const result = { success: true, data: createdCategory };

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// 카테고리 리스트 조회
categoryRouter.get('/list', async (req, res, next) => {
  try {
    const categoryList = await categoryService.readCategoryList();

    const result = { success: true, data: categoryList };
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// 카테고리 수정
categoryRouter.patch('/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { parent_category, child_category, species, species_code, species_image } = req.body;
    const DTO = sanitizeObject({
      _id,
      parent_category,
      child_category,
      species,
      species_code,
      species_image,
    });

    const updatedCategory = await categoryService.updateCategory(DTO);
    const result = { success: true, data: updatedCategory };

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

categoryRouter.delete('/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const DTO = { _id };
    console.log(DTO);

    await categoryService.deleteCategory(_id);
    const result = { success: true };
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export { categoryRouter };
