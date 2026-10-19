<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'username',
        'phone',
        'password',
        'role_id',
        'role_name',
        'status',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->role_name === 'Admin') {
            return true;
        }

        $perms = $this->role?->permissions ?? [];
        if (in_array('*', $perms)) return true;

        $targetParts = explode(':', $permission);
        foreach ($perms as $p) {
            if ($p === $permission) return true;
            $parts = explode(':', $p);
            if ($parts[0] === $targetParts[0] && ($parts[1] ?? '') === '*') {
                return true;
            }
        }
        return false;
    }
}
