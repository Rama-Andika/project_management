<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Haruncpi\LaravelIdGenerator\IdGenerator;
use Carbon\Carbon;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'number', 'project_name', 'status', 'note', 'prefix_number'
    ];

    // public function getCreatedAtAttribute()
    // {
    //     if (!is_null($this->attributes['created_at'])) {
    //         return Carbon::createFromTimestamp(strtotime($this->attributes['created_at']))
    //             ->timezone('Asia/Kuala_Lumpur')
    //             ->toDateTimeString();
    //     }
    // }

    public function projectDetails()
    {
        return $this->hasMany(ProjectDetail::class, 'project_id', 'id');
    }



    //    public static function boot()
    //   {
    //       parent::boot();
    //       self::creating(function ($projectName) {
    //           $projectName->number = IdGenerator::generate(['table' => 'project_names', 'length' => 5, 'prefix' => '0']);
    //       });
    //   }
}
