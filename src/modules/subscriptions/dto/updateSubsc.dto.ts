import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionDto } from './subscriptions.dto';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}
