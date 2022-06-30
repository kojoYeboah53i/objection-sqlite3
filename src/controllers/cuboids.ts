import { Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { Id } from 'objection';
import { Cuboid, Bag } from '../models';

export const list = async (req: Request, res: Response): Promise<Response> => {
  const ids = req.query.ids as Id[];
  const cuboids = await Cuboid.query().findByIds(ids).withGraphFetched('bag');

  return res.status(200).json(cuboids);
};

export const get = async (req: Request, res: Response): Promise<Response> => {
  const id = req.params.id;
  try {
    const cuboid = await Cuboid.query().findById(id);
    if (!cuboid) {
      throw new Error(`cuboid with id ${id} is not found`);
    }
    return res.status(HttpStatus.OK).json(cuboid);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(HttpStatus.NOT_FOUND).send('cuboid not found');
    }
  }
  return res.status(HttpStatus.NOT_FOUND).send('cuboid not found');
};

export const updateCuboid = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const cuboidBeforeUpdate = await Cuboid.query().findById(id);

  const { width, height, depth, bagId } = req.body;
  try {
    if (!bagId) {
      throw new Error(`bagId cannot be null`);
    }
    const totalBagVolume = await Bag.query()
      .select('volume')
      .where('id', bagId);
    // return res.status(200).json(totalBagVolume);

    //get all cuboid volumes in bag
    const cuboidVolume = await Cuboid.query()
      .select('volume')
      .where('bagId', bagId);

    const payloadVolume = cuboidVolume.reduce(
      (acc, cuboidVolume) => acc + cuboidVolume.volume,
      0
    );
    const bagVolume = totalBagVolume.reduce(
      (acc, volume) => acc + totalBagVolume.volume,
      0
    );
    return res.status(200).json(payloadVolume);
    //type cast totalBagVolume to integer

    const availableVolume =  - payloadVolume;
    // return res.status(200).json(bag);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(HttpStatus.NOT_MODIFIED).json({ err: err.message });
    }
  }
  return res
    .status(HttpStatus.NOT_ACCEPTABLE)
    .json({ err: 'failed to create cuboid' });
};

export const deleteCuboid = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  try {
    const cuboid = await Cuboid.query().findById(id);
    if (!cuboid) {
      throw new Error(`cuboid with id ${id} is not found`);
    }
    const result = await Cuboid.query().deleteById(id);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).send('id not found');
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(HttpStatus.NOT_MODIFIED).json({ err: err.message });
    }
  }
  return res
    .status(HttpStatus.OK)
    .send(`cuboid with id ${id} deleted successfully`);
};

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { width, height, depth, bagId } = req.body;
  try {
    if (!bagId) {
      throw new Error(`bagId cannot be null`);
    }

    const volume = width * height * depth;

    const cuboid = await Cuboid.query().insert({
      width,
      height,
      depth,
      bagId,
      volume,
    });
    if (!cuboid) {
      throw new Error(`failed to created cuboid`);
    }
    return res.status(HttpStatus.CREATED).json(cuboid);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(HttpStatus.NOT_ACCEPTABLE).json({ err: err.message });
    }
  }
  return res
    .status(HttpStatus.NOT_ACCEPTABLE)
    .json({ err: 'failed to create cuboid' });
};
