<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShowroomSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    public static function getSetting(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) return $default;

        return match ($setting->type) {
            'json' => json_decode($setting->value, true),
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $setting->value,
            'decimal' => (float) $setting->value,
            default => $setting->value,
        };
    }

    public static function setSetting(string $key, $value, string $type = 'string')
    {
        $valToStore = is_array($value) ? json_encode($value) : (string) $value;
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $valToStore, 'type' => $type]
        );
    }
}
